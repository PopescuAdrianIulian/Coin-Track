package coin_track.crypto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    private static final String COIN_GECKO_API_BASE_URL = "https://api.coingecko.com/api/v3";

    @Bean
    public WebClient coinGeckoWebClient() {
        return WebClient.builder()
                .baseUrl(COIN_GECKO_API_BASE_URL)
                .build();
    }
}