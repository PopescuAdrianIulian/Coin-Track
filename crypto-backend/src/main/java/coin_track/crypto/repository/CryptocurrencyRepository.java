package coin_track.crypto.repository;

import coin_track.crypto.entity.Cryptocurrency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CryptocurrencyRepository extends JpaRepository<Cryptocurrency,String> {
    List<Cryptocurrency> findTop100ByOrderByMarketCapDesc();
    List<Cryptocurrency> findBySymbolContainingIgnoreCaseOrNameContainingIgnoreCase(String symbol, String name);
}
