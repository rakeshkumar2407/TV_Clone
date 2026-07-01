package com.tvplayer.model;

public class Channel {
    private String name;
    private String logo;
    private String url;
    private String country;
    private String category;
    private String language;

    public Channel() {}

    public Channel(String name, String logo, String url, String country, String category, String language) {
        this.name = name;
        this.logo = logo;
        this.url = url;
        this.country = country;
        this.category = category;
        this.language = language;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLogo() { return logo; }
    public void setLogo(String logo) { this.logo = logo; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
