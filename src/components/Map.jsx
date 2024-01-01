import {useEffect, useReducer} from "react";
import {useGeolocated} from "react-geolocated";
import '../components.css';
import '../assets/css/animation.css';
const Map = () => {
    const [state, setState] = useReducer(
        (state, newState) => ({
            ...state,
            ...newState,
        }),
        {
            lat: null,
            long: null,
            stations: []
        },
    );

    useEffect(() => {
        if(state.long && state.lat)
        {
            initMap(state.lat, state.long, state.stations)
        }

    }, [state.long, state.lat]);

    const { isGeolocationAvailable, isGeolocationEnabled} =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            watchPosition: true,
            userDecisionTimeout: 10000,
            watchLocationPermissionChange: false,
        });

    useEffect(() => {
        if (isGeolocationAvailable && isGeolocationEnabled) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setState({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    })
                    console.log("New location:", position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 10,
                }
            );
            return () => {
                navigator.geolocation.clearWatch(watchId);
            };
        }
    }, [isGeolocationAvailable, isGeolocationEnabled]);


    return <div className={'map'} >
        <div id="map" style={{width:'100%', height: '100%'}} />
    </div>
}

export default Map;

const initMap = async (lat, long, stations) => {
    console.log(lat, long);
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapMarker, YMapDefaultFeaturesLayer} = ymaps3;
    const map = new YMap(
        document.getElementById('map'),
        {
            location: {
                center: [long, lat - 0.004],
                zoom: 15
            }
        }
    );

    const defaultSchemeLayer = new YMapDefaultSchemeLayer({theme: 'dark',  nightModeEnabled: true});
    map.addChild(defaultSchemeLayer);
    map.addChild(new YMapDefaultFeaturesLayer());
    const placeMark = document.createElement('div');
    placeMark.className = 'placeMark';
    placeMark.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M7.99994 25.6667C7.99994 27.6799 9.65342 29.3333 11.6666 29.3333L20.3333 29.3333C22.3465 29.3333 23.9999 27.6799 23.9999 25.6667L23.9999 9.00001C23.9999 6.98682 22.3465 5.33334 20.3333 5.33334L18.6666 5.33334L18.6666 4.00001C18.6666 3.26334 18.0699 2.66667 17.3333 2.66667L14.6666 2.66667C13.9299 2.66667 13.3333 3.26334 13.3333 4.00001L13.3333 5.33334L11.6666 5.33334C9.65342 5.33334 7.99994 6.98682 7.99994 9.00001L7.99994 25.6667ZM9.99994 25.6667L9.99994 9.00001C9.99994 8.06786 10.7345 7.33334 11.6666 7.33334L20.3333 7.33334C21.2654 7.33334 21.9999 8.06786 21.9999 9.00001L21.9999 25.6667C21.9999 26.5988 21.2654 27.3333 20.3333 27.3333L11.6666 27.3333C10.7345 27.3333 9.99994 26.5988 9.99994 25.6667ZM11.9999 24C11.9999 24.7367 12.5966 25.3333 13.3333 25.3333L18.6666 25.3333C19.4033 25.3333 19.9999 24.7367 19.9999 24L19.9999 22.6667C19.9999 21.93 19.4033 21.3333 18.6666 21.3333L13.3333 21.3333C12.5966 21.3333 11.9999 21.93 11.9999 22.6667L11.9999 24Z" fill="white"/></svg>`;
    map.addChild(new YMapMarker({coordinates: [long, lat]}, placeMark));
}