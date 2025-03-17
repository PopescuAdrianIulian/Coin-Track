package coin_track.crypto.controller;

import coin_track.crypto.entity.Cryptocurrency;
import coin_track.crypto.service.CryptocurrencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cryptocurrencies")

public class CryptocurrencyController {

    private final CryptocurrencyService cryptocurrencyService;

    @GetMapping
    public ResponseEntity<List<Cryptocurrency>> getTopCryptocurrencies() {
        return ResponseEntity.ok(cryptocurrencyService.getTopCryptocurrencies());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Cryptocurrency>> searchCryptocurrencies(@RequestParam String query) {
        return ResponseEntity.ok(cryptocurrencyService.searchCryptocurrencies(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cryptocurrency> getCryptocurrencyById(@PathVariable String id) {
        Cryptocurrency tempCrypto = cryptocurrencyService.getCryptocurrencyById(id);
        return ResponseEntity.ok(tempCrypto);
    }
}
