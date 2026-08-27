package com.doxa.backend.repository;

import com.doxa.backend.model.Song;
import org.hibernate.internal.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SongRepository extends JpaRepository<Song, UUID> {

    Optional<Song> findTopByOrderBySongNumberDesc();

    @Query(value = "SELECT * FROM song ORDER BY embedding <=> CAST(:vector AS vector) LIMIT :limit", nativeQuery = true)
    List<Song> findSimilar(@Param("vector") float[] vector, @Param("limit") int limit);
}
