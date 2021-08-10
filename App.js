import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";
import React from "react";
import Loading from "./Loading";
import * as Location from "expo-Location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "5e574ae55250e298e066a15590072675";

export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWeather = async ( latitude, longitude ) => {
    const { data: { main: { temp }, weather } } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    // console.log( data );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp
    });
  }
  getLocation = async () => {
    try {
      await Location.getForegroundPermissionsAsync();
      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();
      this.getWeather( latitude, longitude );
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, condition, temp } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}