import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import BeefreeSDK from '@beefree.io/sdk'
import type { IBeeConfig } from "@beefree.io/sdk/dist/types/bee";

interface BuilderState {
  builderRef: RefObject<BeefreeSDK | null>;
  setBuilder: (builder: BeefreeSDK) => void;
  config: IBeeConfig;
  setConfig: (fn: (config: IBeeConfig) => IBeeConfig) => void;
}

const BuilderContext = createContext<BuilderState | undefined>(undefined);

export function BuilderProvider({ children, staticConfig }: { children: ReactNode, staticConfig: IBeeConfig }) {

  const builderRef = useRef<BeefreeSDK | null>(null);
  const [config, setConfig] = useState<IBeeConfig>(staticConfig);

  useEffect(() => {
    builderRef.current?.loadConfig({ onAutoSave: config.onAutoSave });
  }, [config.onAutoSave])

  function setBuilder(builder: BeefreeSDK) {
    builderRef.current = builder;
  }

  return (
    <BuilderContext.Provider value={{ builderRef, setBuilder, config, setConfig }}>
      {children}
    </BuilderContext.Provider>
  )
}

export const useBuilder = (): BuilderState => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
