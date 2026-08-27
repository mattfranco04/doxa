package com.doxa.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String songNumber;

    private String title;

    private String theme;

    @Column(columnDefinition = "TEXT")
    private String lyrics;

    private LocalDate lastUsedDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(columnDefinition = "VECTOR(1536)")
    private float[] embedding;
}
