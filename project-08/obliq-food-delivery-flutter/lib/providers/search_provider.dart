import 'package:flutter/material.dart';

enum SearchSortOption {
  relevance,
  rating,
  deliveryTime,
  costLowToHigh,
  costHighToLow,
}

class SearchProvider extends ChangeNotifier {
  String _query = '';
  final List<String> _recentSearches = ['Biryani', 'Butter Chicken', 'Pizza', 'Paneer Tikka'];
  final List<String> _trendingSearches = ['North Indian', 'Burgers', 'Gulab Jamun', 'Masala Dosa', 'Chinese'];

  SearchSortOption _sortOption = SearchSortOption.relevance;
  bool _pureVegOnly = false;
  double _minRating = 0.0;
  bool _hasOffersOnly = false;

  String get query => _query;
  List<String> get recentSearches => List.unmodifiable(_recentSearches);
  List<String> get trendingSearches => List.unmodifiable(_trendingSearches);
  SearchSortOption get sortOption => _sortOption;
  bool get pureVegOnly => _pureVegOnly;
  double get minRating => _minRating;
  bool get hasOffersOnly => _hasOffersOnly;

  void setQuery(String newQuery) {
    _query = newQuery;
    notifyListeners();
  }

  void addRecentSearch(String search) {
    String clean = search.trim();
    if (clean.isEmpty) return;
    _recentSearches.removeWhere((s) => s.toLowerCase() == clean.toLowerCase());
    _recentSearches.insert(0, clean);
    if (_recentSearches.length > 8) {
      _recentSearches.removeLast();
    }
    notifyListeners();
  }

  void clearRecentSearches() {
    _recentSearches.clear();
    notifyListeners();
  }

  void setSortOption(SearchSortOption option) {
    _sortOption = option;
    notifyListeners();
  }

  void togglePureVeg(bool val) {
    _pureVegOnly = val;
    notifyListeners();
  }

  void setMinRating(double rating) {
    _minRating = rating;
    notifyListeners();
  }

  void toggleHasOffers(bool val) {
    _hasOffersOnly = val;
    notifyListeners();
  }

  void resetFilters() {
    _sortOption = SearchSortOption.relevance;
    _pureVegOnly = false;
    _minRating = 0.0;
    _hasOffersOnly = false;
    notifyListeners();
  }
}
