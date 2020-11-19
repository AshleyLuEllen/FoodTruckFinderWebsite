import LocationInput from "../components/LocationInput";
import GoogleMap, { Marker } from '../components/GoogleMap';

export default function TestPage(props) {
    return <div>
        <LocationInput/>
        <div style={{height:'600px'}}>
            <GoogleMap
                // center={{ lat: 31.5489, lng: -97.1131 }}
                >
                <Marker
                    position={{ lat: 31.5489, lng: -97.1131 }}
                    label="5"
                    title="Test marker"
                    animation="drop"
                    >
                </Marker>

                <Marker
                    position={{ lat: 31.5489, lng: -97.1181 }}
                    label="4"
                    title="Test marker"
                    animation="drop"
                ></Marker>
            </GoogleMap>
        </div>
    </div>
}