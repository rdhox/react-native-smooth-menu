import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Easing,
  unstable_batchedUpdates,
} from "react-native";

const veryLightLightGrey = "#E8E9EA";
const almostWhite = "#FDFDFD";
const grey = "grey";
const white = "white";
const textNormal = 18;
const textSmall = 15;

export interface OptionsDetails {
  label: string;
  selection: React.ReactNode | string;
  onPressType?: "link" | "slot";
  componentToDisplay?: React.ReactNode;
}

interface Props {
  data: OptionsDetails[];
  heightSlot?: number;
}

const SmoothMenu: React.FC<Props> = (props) => {
  function handleSlot(index: number): void {
    if (indexSelected === null) {
      setIndexSelected(index);
      SlotOut(() => {
        setSlotCompleted(true);
        opacityON();
      });
    } else if (indexSelected === index) {
      SlotIn(() => {
        unstable_batchedUpdates(() => {
          setIndexSelected(null);
          setSlotCompleted(false);
        });
        opacityOFF();
      });
    } else {
      SlotIn(() => {
        opacityOFF();
        unstable_batchedUpdates(() => {
          setSlotCompleted(false);
          setIndexSelected(index);
        });
        SlotOut(() => {
          setSlotCompleted(true);
          opacityON();
        });
      });
    }
  }

  const { data, heightSlot = 180 } = props;

  const animSlot = useRef(new Animated.Value(0)).current;
  // const animArrow = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [indexSelected, setIndexSelected] = useState<number | null>(null);
  const [slotCompleted, setSlotCompleted] = useState<boolean>(false);

  function opacityON(callback?: any) {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start(() => (callback ? callback() : undefined));
  }

  function opacityOFF(callback?: any) {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => (callback ? callback() : undefined));
  }

  function SlotOut(callback?: any) {
    Animated.timing(animSlot, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.in(Easing.linear),
    }).start(() => (callback ? callback() : undefined));
  }
  function SlotIn(callback?: any) {
    Animated.timing(animSlot, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.in(Easing.linear),
    }).start(() => (callback ? callback() : undefined));
  }

  return (
    <View style={styles.container}>
      {data.map((option, i) => {
        const {
          label,
          selection,
          onPressType = "link",
          componentToDisplay,
        } = option;

        return (
          <View key={`items-${i}`}>
            <TouchableOpacity
              style={[
                styles.row,
                { borderBottomWidth: i === data.length - 1 ? 0 : 1 },
              ]}
              onPress={() => handleSlot(i)}
            >
              <Text style={{fontSize: textNormal}}>{label}</Text>
              <View style={styles.selection} >
                {typeof selection === "string" ? (
                  <Text style={{fontSize: textSmall, color: grey}}>
                    {selection}
                  </Text>
                ) : (
                  selection
                )}
              </View>
              {onPressType === "link" ? (
                <View
                  style={{
                    position: "absolute",
                    right: 15,
                  }}
                >
                  <Image
                    style={styles.arrow}
                    source={require("../assets/rightArrow.png")}
                  />
                </View>
              ) : (
                <Animated.View
                  style={{
                    position: "absolute",
                    right: 15,
                    transform: [
                      { rotateZ: "90deg" },
                      {
                        rotateY:
                          indexSelected === i
                            ? animSlot.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0deg", "180deg"],
                              })
                            : "0deg",
                      },
                      { perspective: 1000 },
                    ],
                  }}
                >
                  <Image
                    style={styles.arrow}
                    source={require("../assets/rightArrow.png")}
                  />
                </Animated.View>
              )}
            </TouchableOpacity>
            {componentToDisplay && onPressType === "slot" && (
              <Animated.View
                style={{
                  borderBottomWidth: indexSelected === i ? 1 : 0,
                  borderBottomColor: veryLightLightGrey,
                  height:
                    indexSelected === i
                      ? animSlot.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, heightSlot],
                        })
                      : 0,
                }}
              >
                {indexSelected === i && slotCompleted && (
                  <Animated.View
                    style={[
                      styles.slotContainer,
                      { opacity: indexSelected === i ? opacity : 0 },
                    ]}
                  >
                    {componentToDisplay}
                  </Animated.View>
                )}
              </Animated.View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: almostWhite,
    borderRadius: 10,
    marginTop: 25,
    paddingTop: 10,
    paddingRight: 0,
    paddingBottom: 10,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: veryLightLightGrey,
  },
  row: {
    position: "relative",
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: veryLightLightGrey,
  },
  slotContainer: {
    backgroundColor: white,
    flex: 1,
  },
  selection: {
    marginRight: 40
  },
  arrow: {
    width: 12,
    height: 24,
    tintColor: grey
  }
});

export default SmoothMenu;
