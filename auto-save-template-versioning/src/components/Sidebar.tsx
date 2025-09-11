import { useEffect, useState } from 'react';
import '../App.css'
import { useBuilder } from '../hooks/useBuilder.tsx';
export type AutosaveVersionsItem = { date: string, content: string }

type Props = {
    autosaveVersions: AutosaveVersionsItem[]
}

export const Sidebar = ({ autosaveVersions }: Props) => {
    const { builderRef } = useBuilder()

    const [selectedItem, setSelectedItem] = useState<number>(0);
    const [timer, setTimer] = useState<number>(0);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
      return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
      setSelectedItem(0)
      setTimer(0)
    }, [autosaveVersions])

    return (
        <div className="sidebar">
            <h2>versions: Latest 10 Autosave</h2>
            autosave each 10s: {timer}
            {autosaveVersions.map((item, index) => (
                <div
                  key={index}
                  className="version-item"
                  onClick={() => {
                    builderRef.current?.load(JSON.parse(item.content))
                    setSelectedItem(index)
                  }}>
                    <p>💾 {item.date} {selectedItem == index ? "👈" : ""}</p>
                </div>
            ))}
        </div>
    );
};
