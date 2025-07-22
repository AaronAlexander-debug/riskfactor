"use client"
import 'leaflet/dist/leaflet.css';
import { withRouter } from 'next/router';
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

// export interface DisasterFeature {      
//   county_name: string;       
//   state_code: string;              
//   score: number;
//   scaled_score: number;
// }

export default function Map() {
    const [geoData, setGeoData] = useState(null);
    const [disasterJsonData, setDisasterJsonData] = useState<{ features: any[] } | null>(null);;

    function getColor(risk: number): string {
        return risk > 7.5 ? '#cb181d' :
        risk > 5.0 ? '#fb6a4a' :
        risk > 2.5 ? '#fcae91' :
        risk > 0.0 ? '#fee5d9' :
        '#ffffff';
    }

    // function styleCounty(feature) {
    //     return {
    //         fillColor: getColor(feature.scaled_score),
    //         weight: 2,
    //         opacity: 1,
    //         color: 'white',
    //         dashArray: '3',
    //         fillOpacity: 0.7
    //     };
    // }

    useEffect(() => {
        const fetchGeoJSON = async () => {
        const res = await fetch("/data/gz_2010_us_050_00_500k.json");
        const data = await res.json();
        setGeoData(data);
        };
        fetchGeoJSON();

        const fetchDisasterInfoJSON = async () => {
            const res = await fetch("/data/disaster_info.json");
            const data = await res.json();
            setDisasterJsonData(data);
        };
        fetchDisasterInfoJSON();
    }, []);

    return (
        <div className="h-[500px] p-5">
            <MapContainer center={[37.8, -96.9]} zoom={4} scrollWheelZoom={false} style={{ height: "100%", width: "300%", marginLeft: "-100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* {(geoData && disasterJsonData) && <GeoJSON data={geoData} style={styleCounty}/>} */}
            </MapContainer>
        </div>
    );
};