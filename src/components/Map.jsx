import {useEffect, useReducer, useRef} from "react";
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
            stations: [],
            map: null,
            is_map: false,
        },
    );

    const saveLocation = useRef({
        lat: 0,
        long: 0
    });

    useEffect(() => {
        if(state.long && state.lat)
        {
            (async () => {
                const result = await initMap(state.lat, state.long, state.stations);
                setState({map:result})
              })();
        }

    }, [state.is_map]);


    useEffect(() => {
        if(state.long && state.lat && state.map)
        {
            markerMaker(state.map, state.long,  state.lat);
        }

    }, [state.long, state.lat, state.map]);

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
                    if(position.coords.latitude !== saveLocation.current.lat || position.coords.longitude !== saveLocation.current.long)
                    {
                        setState({
                            lat: position.coords.latitude,
                            long: position.coords.longitude,
                            is_map: true,
                        });
                        saveLocation.current = {
                            lat: position.coords.latitude,
                            long: position.coords.longitude,
                        };
                        console.log("New location:", position.coords.latitude, position.coords.longitude);
                    }
                
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
        <div className="placeMark" />
    </div>
}

export default Map;




const initMap = async (lat, long, stations) => {
    await ymaps3.ready;
    const {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer} = ymaps3;
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

    return await map;
  
}

const markerMaker = async (map, long, lat) => {
    await ymaps3.ready;
    const {YMapMarker} = ymaps3;
    const placeMark = document.querySelector('.placeMark');
    placeMark.innerHTML=`<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.62518 15.7734C5.63139 16.1707 5.79498 16.5494 6.08005 16.8262C6.36512 17.103 6.74837 17.2554 7.14569 17.25L8.68671 17.25C8.66566 18.2428 8.64569 19.2408 8.64569 20.4141C8.64569 25.0941 8.88675 27.2852 9.35175 29.8652C9.75675 32.1152 11.6159 33.75 13.7609 33.75L21.5305 33.75C23.6755 33.75 25.5346 32.1152 25.9396 29.8652C26.4046 27.2852 26.6457 25.0941 26.6457 20.4141C26.6457 19.2399 26.6257 18.2426 26.6047 17.25L28.1457 17.25C28.3445 17.2528 28.5418 17.2161 28.7263 17.142C28.9107 17.0678 29.0786 16.9578 29.2201 16.8182C29.3617 16.6787 29.4741 16.5124 29.5508 16.329C29.6275 16.1456 29.6671 15.9488 29.6671 15.75C29.6671 15.5512 29.6275 15.3544 29.5508 15.171C29.4741 14.9876 29.3617 14.8213 29.2201 14.6818C29.0786 14.5422 28.9107 14.4321 28.7263 14.358C28.5418 14.2839 28.3445 14.2472 28.1457 14.25L26.4933 14.25C26.3589 11.6829 26.1405 9.62789 25.8195 7.71093C25.4445 5.41593 23.5707 3.75 21.3957 3.75L13.8957 3.75C11.7057 3.75 9.84686 5.41594 9.47186 7.71094C9.15069 9.62012 8.93249 11.6778 8.79803 14.25L7.14569 14.25C6.94501 14.2472 6.74581 14.2848 6.5599 14.3604C6.37399 14.436 6.20514 14.5482 6.06336 14.6903C5.92158 14.8323 5.80975 15.0014 5.73448 15.1874C5.65921 15.3735 5.62205 15.5728 5.62518 15.7734ZM11.7072 15.7178L11.7072 15.6885C11.7282 14.8845 12.3886 14.25 13.1926 14.25L22.0988 14.25C22.9043 14.25 23.5632 14.8845 23.5842 15.6885L23.5842 15.7178C23.6067 16.5533 22.9343 17.25 22.0988 17.25L13.1926 17.25C12.3571 17.25 11.6847 16.5533 11.7072 15.7178ZM11.9299 27.8789C11.8474 27.0044 12.5407 26.25 13.4182 26.25L21.8732 26.25C22.7507 26.25 23.444 27.0044 23.3615 27.8789C23.36 27.8894 23.3601 27.8977 23.3586 27.9082C23.2866 28.6717 22.6368 29.25 21.8703 29.25L13.4211 29.25C12.6531 29.25 12.0048 28.6703 11.9328 27.9053C11.9313 27.8963 11.9299 27.8879 11.9299 27.8789Z" fill="white"/>
    </svg> `;
    map.addChild(new YMapMarker({coordinates: [long, lat]}, placeMark));
}