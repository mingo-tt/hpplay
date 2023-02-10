package com.mingo.hpplay.repository;

import com.mingo.hpplay.object.entity.VideoState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoStateRepository extends JpaRepository<VideoState, Integer> {
}
