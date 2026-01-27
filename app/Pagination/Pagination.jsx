import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "./paginationStyles";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <View style={styles.container}>
      {/* Prev */}
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
        style={[
          styles.navBtn,
          currentPage === 1 && styles.disabled,
        ]}
      >
        <Text style={styles.navText}>‹</Text>
      </TouchableOpacity>

      {/* Numbers */}
      {getPages().map((page) => (
        <TouchableOpacity
          key={page}
          onPress={() => onPageChange(page)}
          style={[
            styles.pageBtn,
            page === currentPage && styles.activePage,
          ]}
        >
          <Text
            style={[
              styles.pageText,
              page === currentPage && styles.activeText,
            ]}
          >
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Next */}
      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
        style={[
          styles.navBtn,
          currentPage === totalPages && styles.disabled,
        ]}
      >
        <Text style={styles.navText}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
