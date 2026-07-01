package com.tvplayer.controller;

import com.tvplayer.model.Channel;
import com.tvplayer.service.M3UParserService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/channels")
@CrossOrigin(origins = "*")
public class ChannelController {

    private final M3UParserService m3UParserService;

    public ChannelController(M3UParserService m3UParserService) {
        this.m3UParserService = m3UParserService;
    }

    @GetMapping
    public Flux<Channel> getAllChannels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        return m3UParserService.fetchAndParseChannels()
                .skip(page * size)
                .take(size);
    }

    @GetMapping("/countries")
    public Mono<List<String>> getCountries() {
        return m3UParserService.fetchAndParseChannels()
                .map(Channel::getCountry)
                .distinct()
                .sort()
                .collectList();
    }

    @GetMapping("/filter")
    public Flux<Channel> filterChannels(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        Flux<Channel> channels = m3UParserService.fetchAndParseChannels();
        
        if (country != null && !country.isEmpty()) {
            channels = channels.filter(channel -> 
                channel.getCountry() != null && channel.getCountry().equalsIgnoreCase(country));
        }
        
        if (category != null && !category.isEmpty()) {
            channels = channels.filter(channel -> 
                channel.getCategory() != null && channel.getCategory().equalsIgnoreCase(category));
        }
        
        return channels.skip(page * size).take(size);
    }
}
