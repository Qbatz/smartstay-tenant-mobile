import React from "react";
import { View, StyleSheet } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

const SkeletonItem = ({ style }) => (
  <ShimmerPlaceholder
    LinearGradient={LinearGradient}
    style={style}
  />
);

export const SkeletonLoader = ({ loading, children }) => {
  if (!loading) return children;

  return (
    <View style={styles.container}>

      {/* Card */}
      <View style={styles.card}>

        {/* Header */}
        <View style={styles.row}>
          {/* <SkeletonItem style={styles.avatar} /> */}
          <SkeletonItem style={styles.title} />
        </View>

        {/* Big content */}
        <SkeletonItem style={styles.bigBox} />

        {/* Lines */}
        <SkeletonItem style={styles.line} />
        <SkeletonItem style={styles.lineSmall} />

        {/* Bottom lines */}
        <SkeletonItem style={styles.footerLine} />
        <SkeletonItem style={styles.footerLineSmall} />

        <SkeletonItem style={styles.footerLine} />
        <SkeletonItem style={[styles.footerLineSmall]} />

        <SkeletonItem style={styles.footerLine} />
        <SkeletonItem style={styles.footerLineSmall} />

        <SkeletonItem style={styles.footerLine} />
        <SkeletonItem style={styles.footerLineSmall} />


        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  title: {
    marginLeft: 12,
    height: 20,
    width: "50%",
    borderRadius: 6,
  },
  bigBox: {
    height: 120,
    borderRadius: 10,
    marginBottom: 16,
  },
  line: {
    height: 15,
    width: "80%",
    borderRadius: 6,
    marginBottom: 10,
  },
  lineSmall: {
    height: 15,
    width: "60%",
    borderRadius: 6,
    marginBottom: 16,
  },
  footerLine: {
    height: 12,
    width: "90%",
    borderRadius: 6,
    marginBottom: 8,

  },
  footerLineSmall: {
    height: 12,
    width: "70%",
    borderRadius: 6,
    paddingTop:10,
    marginTop:20
  },
});