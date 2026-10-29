package com.gamepulse.dto;

public class StartInningsRequestDTO {
    private Long strikerId;
    private Long nonStrikerId;
    private Long bowlerId;

    public StartInningsRequestDTO() {}

    public Long getStrikerId() { return strikerId; }
    public void setStrikerId(Long strikerId) { this.strikerId = strikerId; }

    public Long getNonStrikerId() { return nonStrikerId; }
    public void setNonStrikerId(Long nonStrikerId) { this.nonStrikerId = nonStrikerId; }

    public Long getBowlerId() { return bowlerId; }
    public void setBowlerId(Long bowlerId) { this.bowlerId = bowlerId; }

    public static StartInningsRequestDTOBuilder builder() { return new StartInningsRequestDTOBuilder(); }

    public static class StartInningsRequestDTOBuilder {
        private Long strikerId;
        private Long nonStrikerId;
        private Long bowlerId;

        public StartInningsRequestDTOBuilder strikerId(Long strikerId) { this.strikerId = strikerId; return this; }
        public StartInningsRequestDTOBuilder nonStrikerId(Long nonStrikerId) { this.nonStrikerId = nonStrikerId; return this; }
        public StartInningsRequestDTOBuilder bowlerId(Long bowlerId) { this.bowlerId = bowlerId; return this; }

        public StartInningsRequestDTO build() {
            StartInningsRequestDTO s = new StartInningsRequestDTO();
            s.strikerId = this.strikerId;
            s.nonStrikerId = this.nonStrikerId;
            s.bowlerId = this.bowlerId;
            return s;
        }
    }
}
