package com.doxa.backend.service;

import com.doxa.backend.model.Song;
import com.doxa.backend.repository.SongRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.*;

@Service
public class SongIngestionService {

    // matches: "1. A re Y ou W Ashed in the B lood ? (G)"
    // key is optional — some songs have no key
    private static final Pattern SONG_HEADER = Pattern.compile(
            "^(\\d+)\\.\\s+(.+?)(?:\\s+\\(([A-Ga-g][#b]?m?)\\))?\\s*$"
    );

    // skip Bible verse entries like "Ps", "Isa", "Jn"
    private static final Pattern SCRIPTURE_PREFIX = Pattern.compile(
            "^(Ps|Isa|Jn|Rom|Rev|Matt?|Luk?e?|Acts|Heb|Col|Eph)$"
    );

    // matches repeat markers like "2x", "3x"
    private static final Pattern REPEAT_MARKER = Pattern.compile("^\\d+x$");

    private static final Set<String> SECTION_LABELS = Set.of(
            "Chorus", "Verse", "Bridge", "Instrumental",
            "Pleading", "Refrain", "Intro", "Outro", "Tag"
    );

    private final SongRepository songRepository;
    private final EmbeddingService embeddingService;

    public SongIngestionService(SongRepository songRepository, EmbeddingService embeddingService) {
        this.songRepository = songRepository;
        this.embeddingService = embeddingService;
    }

    public int ingestPdf(MultipartFile file) throws IOException {
        List<Song> songs = parsePdf(file);

        for (Song song : songs) {
            Song saved = songRepository.save(song);
            generateEmbeddingAsync(saved);
        }

        return songs.size();
    }

    public List<Song> parsePdf(MultipartFile file) throws IOException {
        String rawText;
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            rawText = new PDFTextStripper().getText(document);
        }

        return parseSongs(rawText);
    }

    @Async
    public void generateEmbeddingAsync(Song song) {
        try {
            String textToEmbed = song.getTitle() + " " + song.getLyrics();
            float[] vector = embeddingService.getEmbedding(textToEmbed);
            song.setEmbedding(vector);
            songRepository.save(song);
        } catch (Exception e) {
            System.err.println("Failed to embed: " + song.getTitle() + " — " + e.getMessage());
        }
    }

    private List<Song> parseSongs(String rawText) {
        List<Song> songs = new ArrayList<>();
        String[] lines = rawText.split("\\n");

        Song currentSong = null;
        StringBuilder currentLyrics = new StringBuilder();

        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.isEmpty()) continue;

            Matcher matcher = SONG_HEADER.matcher(trimmed);

            if (matcher.matches()) {
                String numberStr = matcher.group(1);

                // skip scripture entries like "Ps 91:1-2"
                if (SCRIPTURE_PREFIX.matcher(numberStr).matches()) continue;

                // save previous song
                if (currentSong != null) {
                    currentSong.setLyrics(currentLyrics.toString().trim());
                    if (currentSong.getLyrics().length() > 0) {
                        songs.add(currentSong);
                    }
                }

                currentSong = new Song();
                currentSong.setSongNumber(numberStr);
                currentSong.setTitle(cleanTitle(matcher.group(2)));
                currentLyrics = new StringBuilder();

            } else if (currentSong != null && !isSectionLabel(trimmed)) {
                // cap lyrics at 3000 chars to catch runaway parsing
                if (currentLyrics.length() < 3000) {
                    currentLyrics.append(trimmed).append("\n");
                }
            }
        }

        // last song
        if (currentSong != null && currentLyrics.length() > 0) {
            currentSong.setLyrics(currentLyrics.toString().trim());
            songs.add(currentSong);
        }

        return songs;
    }

    /**
     * Fixes InDesign spaced-character titles.
     * Strategy: the PDF alternates between spaced caps and normal words.
     * We normalise the whole title to title case after collapsing the spaces.
     */
    private String cleanTitle(String raw) {
        // Step 1 — collapse single spaced characters: "A re" → "Are"
        // Replace space between two word-characters where at least one side is a single char
        String collapsed = raw.replaceAll("(?<=\\b\\w)\\s+(?=\\w\\b)", "");

        // Step 2 — normalize spacing
        collapsed = collapsed.replaceAll("\\s+", " ").trim();

        // Step 3 — title case (capitalize first letter of each word)
        StringBuilder titleCase = new StringBuilder();
        for (String word : collapsed.split(" ")) {
            if (!word.isEmpty()) {
                if (titleCase.length() > 0) titleCase.append(" ");
                titleCase.append(Character.toUpperCase(word.charAt(0)));
                if (word.length() > 1) titleCase.append(word.substring(1).toLowerCase());
            }
        }

        return titleCase.toString();
    }

    private boolean isSectionLabel(String line) {
        return SECTION_LABELS.contains(line) ||
                REPEAT_MARKER.matcher(line).matches() ||
                line.startsWith("Repeat") ||
                line.startsWith("Final:");
    }
}