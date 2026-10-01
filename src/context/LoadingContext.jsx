import React, { createContext, useContext, useState, useCallback } from "react";
import LoadingOverlay from "../components/LoadingOverlay/LoadingOverlay";
import Spinner from "../components/Spinner/Spinner";

const LoadingContext = createContext({
  isLoading: false,
  showLoading: () => {},
  hideLoading: () => {},
});

/**
 * LoadingProvider wraps your application to provide global loading overlays.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Object} [props.defaultConfig] - Default fallback options for global loading.
 */
export const LoadingProvider = ({ children, defaultConfig = {} }) => {
  const [loadingState, setLoadingState] = useState({
    active: false,
    text: "",
    backdrop: true,
    fullScreen: true,
    variant: "ring",
    image: undefined,
    spinner: undefined,
    ...defaultConfig,
  });

  const showLoading = useCallback((options) => {
    if (typeof options === "string") {
      setLoadingState((prev) => ({
        ...prev,
        active: true,
        text: options,
      }));
    } else if (typeof options === "object" && options !== null) {
      setLoadingState((prev) => ({
        ...prev,
        ...options,
        active: true,
      }));
    } else {
      setLoadingState((prev) => ({
        ...prev,
        active: true,
      }));
    }
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState((prev) => ({
      ...prev,
      active: false,
    }));
  }, []);

  const customSpinner = loadingState.spinner || (
    <Spinner
      variant={loadingState.variant}
      image={loadingState.image}
      text={loadingState.text}
      color={loadingState.backdrop ? "#ffffff" : undefined}
    />
  );

  return (
    <LoadingContext.Provider
      value={{
        isLoading: loadingState.active,
        showLoading,
        hideLoading,
        loadingState,
      }}
    >
      {children}
      <LoadingOverlay
        active={loadingState.active}
        backdrop={loadingState.backdrop}
        fullScreen={loadingState.fullScreen}
        spinner={customSpinner}
      />
    </LoadingContext.Provider>
  );
};

/**
 * Hook to consume global loading functions inside any React component.
 *
 * @returns {{ isLoading: boolean, showLoading: (options?: string|Object) => void, hideLoading: () => void }}
 */
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

export default LoadingContext;
