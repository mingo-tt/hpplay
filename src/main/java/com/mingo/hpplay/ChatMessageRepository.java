package com.mingo.hpplay;

import com.mingo.hpplay.object.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * <p></p>
 *
 * @author HuMingAn
 * @version 1.0
 **/
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
}
