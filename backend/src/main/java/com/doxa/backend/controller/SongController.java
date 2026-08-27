package com.doxa.backend.controller;

import com.doxa.backend.model.Song;
import com.doxa.backend.service.SongIngestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongIngestionService songIngestionService;

    public SongController(SongIngestionService songIngestionService) {
        this.songIngestionService = songIngestionService;
    }

    @PostMapping("/import")
    public ResponseEntity<String> importPdf(@RequestParam("file") MultipartFile file) {
        try {
            int count = songIngestionService.ingestPdf(file);
            return ResponseEntity.ok("Import started — " + count + " songs saved. Embeddings generating in background.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Import failed: " + e.getMessage());
        }
    }

    @PostMapping("/import/dry-run")
    public ResponseEntity<?> dryRun(@RequestParam("file") MultipartFile file) throws IOException {
        List<Song> songs = songIngestionService.parsePdf(file);

        // return just the parsed titles and keys — no DB, no OpenAI
        List<Map<String, String>> preview = songs.stream()
                .map(s -> Map.of(
                        "number", String.valueOf(s.getSongNumber()),
                        "title",  s.getTitle(),
                        "lyricsLength", String.valueOf(
                                s.getLyrics() != null ? s.getLyrics().length() : 0)
                ))
                .toList();

        return ResponseEntity.ok(Map.of(
                "totalSongs", songs.size(),
                "songs", preview
        ));
    }
}
