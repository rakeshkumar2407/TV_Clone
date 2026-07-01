package com.tvplayer.service;

import com.tvplayer.model.Channel;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class M3UParserService {
    private static final String M3U_URL = "https://iptv-org.github.io/iptv/index.m3u";
    private final WebClient webClient;
    private final List<Channel> cachedChannels = new CopyOnWriteArrayList<>();
    private volatile boolean cacheInitialized = false;

    public M3UParserService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }

    public Flux<Channel> fetchAndParseChannels() {
        if (cacheInitialized && !cachedChannels.isEmpty()) {
            return Flux.fromIterable(cachedChannels);
        }
        
        return webClient.get()
                .uri(M3U_URL)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(60))
                .doOnNext(content -> {
                    List<Channel> channels = parseM3UToList(content);
                    cachedChannels.clear();
                    cachedChannels.addAll(channels);
                    cacheInitialized = true;
                })
                .flatMapMany(content -> Flux.fromIterable(cachedChannels))
                .onErrorResume(e -> {
                    System.err.println("Error fetching channels: " + e.getMessage());
                    if (cacheInitialized && !cachedChannels.isEmpty()) {
                        return Flux.fromIterable(cachedChannels);
                    }
                    return Flux.empty();
                });
    }

    private List<Channel> parseM3UToList(String m3uContent) {
        List<Channel> channels = new ArrayList<>();
        String[] lines = m3uContent.split("\n");
        
        String currentName = null;
        String currentLogo = null;
        String currentCountry = null;
        String currentCategory = null;
        String currentLanguage = null;

        for (String line : lines) {
            line = line.trim();
            if (line.startsWith("#EXTINF:")) {
                currentName = extractAttribute(line, "tvg-name");
                if (currentName == null || currentName.isEmpty()) {
                    int commaIndex = line.lastIndexOf(',');
                    if (commaIndex != -1) {
                        currentName = line.substring(commaIndex + 1).trim();
                    }
                }
                currentLogo = extractAttribute(line, "tvg-logo");
                currentCountry = extractAttribute(line, "tvg-country");
                currentCategory = extractAttribute(line, "group-title");
                currentLanguage = extractAttribute(line, "tvg-language");
                
                // Extract country from tvg-id if not found
                if (currentCountry == null || currentCountry.isEmpty()) {
                    String tvgId = extractAttribute(line, "tvg-id");
                    if (tvgId != null && !tvgId.isEmpty()) {
                        // tvg-id format: "ChannelName.countryCode@quality"
                        int atIndex = tvgId.lastIndexOf('@');
                        String idPart = atIndex != -1 ? tvgId.substring(0, atIndex) : tvgId;
                        int lastDotIndex = idPart.lastIndexOf('.');
                        if (lastDotIndex != -1) {
                            currentCountry = idPart.substring(lastDotIndex + 1).toUpperCase();
                        }
                    }
                }
                
                // Try alternative country attribute names
                if (currentCountry == null || currentCountry.isEmpty()) {
                    currentCountry = extractAttribute(line, "country");
                }
            } else if (line.startsWith("http") && currentName != null) {
                Channel channel = new Channel();
                channel.setName(currentName);
                channel.setLogo(currentLogo);
                channel.setUrl(line);
                
                // Only set country if it's not null and not empty
                if (currentCountry != null && !currentCountry.isEmpty()) {
                    channel.setCountry(currentCountry);
                } else {
                    channel.setCountry("Unknown");
                }
                
                channel.setCategory(currentCategory != null ? currentCategory : "General");
                channel.setLanguage(currentLanguage != null ? currentLanguage : "Unknown");
                channels.add(channel);
                
                currentName = null;
                currentLogo = null;
                currentCountry = null;
                currentCategory = null;
                currentLanguage = null;
            }
        }

        System.out.println("Parsed " + channels.size() + " channels");
        System.out.println("Sample countries: " + channels.stream()
            .map(Channel::getCountry)
            .distinct()
            .limit(10)
            .toList());
        
        return channels;
    }

    private String extractAttribute(String line, String attributeName) {
        String pattern = attributeName + "=\"";
        int startIndex = line.indexOf(pattern);
        if (startIndex != -1) {
            startIndex += pattern.length();
            int endIndex = line.indexOf("\"", startIndex);
            if (endIndex != -1) {
                return line.substring(startIndex, endIndex);
            }
        }
        return null;
    }
}
