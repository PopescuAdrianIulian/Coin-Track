package coin_track.crypto.controller;

import coin_track.crypto.entity.Cryptocurrency;
import coin_track.crypto.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
@RequiredArgsConstructor
@Slf4j
public class WatchListController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getWatchlist(HttpSession session) {
        String username = (String) session.getAttribute("username");
        log.info("Getting watchlist for user: {}", username);
        List<Cryptocurrency> watchlist = userService.getWatchlist(username);
        return ResponseEntity.ok(watchlist);
    }

    @PostMapping("/{cryptoId}")
    public ResponseEntity<?> addToWatchlist(@PathVariable String cryptoId, HttpSession session) {
        String username = (String) session.getAttribute("username");
        userService.addToWatchlist(username, cryptoId);
        return ResponseEntity.ok(cryptoId);
    }

    @DeleteMapping("/{cryptoId}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable String cryptoId, HttpSession session) {
        String username = (String) session.getAttribute("username");
        userService.removeFromWatchlist(username, cryptoId);
        return ResponseEntity.ok(cryptoId);
    }
}