# OBLIQ Food Delivery — Udaipur Data Migration Report

## Executive Summary
This document records the data migration process converting the OBLIQ Food Delivery application from its initial Jodhpur mock dataset into a 100% Udaipur-centric food delivery platform.

---

## Migration Summary Matrix

| Data Domain | Jodhpur Configuration | Udaipur Migration | Status |
| :--- | :--- | :--- | :--- |
| **Primary City** | Jodhpur, Rajasthan | Udaipur, Rajasthan | Completed |
| **Localities** | Ratanada, Shastri Nagar, Sardarpura, Paota | Hiran Magri, Bhuwana, Fatehpura, Ashok Nagar, Surajpole, Lake Pichola, Fateh Sagar, Shobhagpura, Panchwati, Saheli Nagar, Sukher, Chandpole, Old City | Completed |
| **Restaurants** | Royal Biryani, Curry House, Pizza Palace, Burger Junction, South Indian Express, Thali 360 | Burger Farm (Demo), Rominus Pizza (Demo), Domino's (Demo), Lake City Thali House, Mewar Rasoi, Pichola Rooftop Kitchen, City Palace Cafe, Udaipur Street Kitchen, Aravali Food Corner, Mewar Zaika, Fateh Sagar Cafe, Bawarchi (Demo), Sardar Ji Soya Chaap (Demo), Barbeque Nation (Demo), Chinese Wok (Demo), Aravali Cafe & Bakery | Completed |
| **Local Food Items** | Standard Biryani & North Indian | Dal Baati Churma, Pyaaz Kachori, Mirchi Vada, Poha Jalebi, Gatte Ki Sabzi, Ker Sangri, Bajra Roti, Rajasthani Thali, Laal Maas, Ghewar, Rabdi, Kulhad Chai | Completed |
| **Curated Collections** | Generic Jodhpur lists | "Udaipur's Must Try", "Best Rajasthani Food", "Lake View Restaurants", "Best Breakfast in Udaipur", "Best Kachori in Udaipur", "Street Food of Udaipur", "Food Under ₹199" | Completed |
| **Dining Spots** | Clock Tower, Gulab Sagar | Lake Pichola Rooftop, Fateh Sagar Waterfront, Old City Heritage, Fatehpura Family Dining, Panchwati Garden Dining | Completed |
| **Coupons** | `OBLIQ10`, `ZOMATO50` | `UDAIPUR50`, `MEWAR100`, `LAKECITY`, `PICHOLA50`, `WELCOMEOBLIQ`, `FIRSTORDER`, `UDAIPURFOOD` | Completed |
| **Quick Market** | Jodhpur Hub | Instant 10-Minute Delivery across Udaipur local sectors | Completed |
| **Location System** | Default Jodhpur | Default Udaipur (Hiran Magri, Bhuwana, Fateh Sagar) with GPS fallback | Completed |

---

## Data Safety & Verification
- **Demographic Accuracy**: All localities, pin codes (313001, 313002, 313004), and landmark references belong strictly to Udaipur, Rajasthan.
- **Reference Real Businesses**: Real-world brand names (e.g. Burger Farm, Rominus, Domino's, Bawarchi) are marked as `(Demo Data)` to avoid false claims of official live affiliation.
- **Currency Compliance**: 100% Indian Rupees (`₹`). Zero USD (`$`) symbols present.
