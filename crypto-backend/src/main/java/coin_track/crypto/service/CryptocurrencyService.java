package coin_track.crypto.service;

import coin_track.crypto.entity.Cryptocurrency;
import coin_track.crypto.repository.CryptocurrencyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CryptocurrencyService {

    private final CryptocurrencyRepository cryptoRepository;
    private final WebClient coinGeckoClient;

    @Scheduled(fixedRate = 300000) //5 minutes for each update!
    public void updateCryptocurrencyData() {
        log.info("Updating the database");

        coinGeckoClient.get()
                .uri("/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
                .retrieve()
                .bodyToFlux(Map.class)
                .map(this::mapToCryptocurrency)
                .collectList()
                .subscribe(cryptocurrencies -> {
                    cryptoRepository.saveAll(cryptocurrencies);
                    log.info("Updated {} cryptocurrencies", cryptocurrencies.size());
                }, error -> {
                    log.error("Error updating cryptocurrency data", error);
                });
    }

    private Cryptocurrency mapToCryptocurrency(Map<String, Object> cryptoData) {
        Cryptocurrency crypto = new Cryptocurrency();
        crypto.setId((String) cryptoData.get("id"));
        crypto.setSymbol((String) cryptoData.get("symbol"));
        crypto.setName((String) cryptoData.get("name"));

        Object currentPrice = cryptoData.get("current_price");
        crypto.setCurrentPrice(currentPrice != null ? new BigDecimal(currentPrice.toString()) : BigDecimal.ZERO);
        Object marketCap = cryptoData.get("market_cap");
        crypto.setMarketCap(marketCap != null ? new BigDecimal(marketCap.toString()) : BigDecimal.ZERO);
        Object volume = cryptoData.get("total_volume");
        crypto.setVolume24h(volume != null ? new BigDecimal(volume.toString()) : BigDecimal.ZERO);
        Object priceChange = cryptoData.get("price_change_percentage_24h");
        crypto.setPriceChangePercentage24h(priceChange != null ? new BigDecimal(priceChange.toString()) : BigDecimal.ZERO);
        crypto.setImageUrl((String) cryptoData.get("image"));
        crypto.setLastUpdated(LocalDateTime.now());
        return crypto;
    }

    public List<Cryptocurrency> getTopCryptocurrencies() {
        return cryptoRepository.findTop100ByOrderByMarketCapDesc();
    }

    public List<Cryptocurrency> searchCryptocurrencies(String query) {
        return cryptoRepository.findBySymbolContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
    }

    public Cryptocurrency getCryptocurrencyById(String cryptoId) {
        return cryptoRepository.findById(cryptoId).orElseThrow(() -> new RuntimeException("Id not found"));
    }

}


