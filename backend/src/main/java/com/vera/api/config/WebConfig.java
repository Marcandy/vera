package com.vera.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS for the deployed frontend only.
 *
 * In development the browser never needs this: Vite proxies /api to this
 * process, so the page and the API share an origin and there is no cross origin
 * request to permit. That is deliberate, because a permissive dev setup is how
 * a permissive production setup gets shipped.
 *
 * The allowed origin is configuration rather than a wildcard. "*" would let any
 * site on the internet call this API with a browser's credentials attached the
 * moment real authentication exists.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String allowedOrigins;

    public WebConfig(@Value("${vera.cors.allowed-origins:}") String allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        if (allowedOrigins.isBlank()) {
            return;
        }

        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST")
                .allowCredentials(true);
    }
}
