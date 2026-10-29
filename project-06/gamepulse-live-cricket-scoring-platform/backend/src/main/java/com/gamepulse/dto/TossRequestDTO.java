package com.gamepulse.dto;

public class TossRequestDTO {
    private Long tossWinnerId;
    private String tossDecision; // "BAT" or "BOWLE"

    public TossRequestDTO() {}

    public Long getTossWinnerId() { return tossWinnerId; }
    public void setTossWinnerId(Long tossWinnerId) { this.tossWinnerId = tossWinnerId; }

    public String getTossDecision() { return tossDecision; }
    public void setTossDecision(String tossDecision) { this.tossDecision = tossDecision; }

    public static TossRequestDTOBuilder builder() { return new TossRequestDTOBuilder(); }

    public static class TossRequestDTOBuilder {
        private Long tossWinnerId;
        private String tossDecision;

        public TossRequestDTOBuilder tossWinnerId(Long tossWinnerId) { this.tossWinnerId = tossWinnerId; return this; }
        public TossRequestDTOBuilder tossDecision(String tossDecision) { this.tossDecision = tossDecision; return this; }

        public TossRequestDTO build() {
            TossRequestDTO t = new TossRequestDTO();
            t.tossWinnerId = this.tossWinnerId;
            t.tossDecision = this.tossDecision;
            return t;
        }
    }
}
