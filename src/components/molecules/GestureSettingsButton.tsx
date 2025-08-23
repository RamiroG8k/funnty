import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "../atoms/button";
import { Move3D } from "lucide-react";
import { useTextConfig } from "@/context/textConfig";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface GestureState {
    isActive: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    direction: "horizontal" | "vertical" | null;
    initialSize: number;
    initialStrokeWidth: number;
    screenWidth: number;
    screenHeight: number;
    buttonRect: DOMRect | null;
}

interface GestureSettingsButtonProps extends VariantProps<typeof Button> {
    className?: string;
    children?: React.ReactNode;
    overlayClassName?: string;
    indicatorClassName?: string;
    size?: "sm" | "lg" | "default" | "icon" | null | undefined;
}

const LONG_PRESS_DURATION = 500;
const GESTURE_THRESHOLD = 15; // minimum movement to determine direction
const SIZE_SENSITIVITY = 0.5; // pixels per pixel moved
const STROKE_SENSITIVITY = 0.05; // stroke width per pixel moved
const EDGE_BUFFER = 50; // buffer from screen edges to prevent min values

/**
 * Gesture-based settings button that allows adjusting text properties through touch interactions.
 *
 * Usage:
 * 1. Long press the settings button to activate gesture mode (500ms)
 * 2. Once activated, move your finger:
 *    - Vertically: Controls font size (up = larger, down = smaller)
 *    - Horizontally: Controls stroke width (right = thicker, left = thinner)
 * 3. Visual feedback shows current values during adjustment
 * 4. Haptic feedback confirms activation and direction changes
 *
 * @param variant - Button variant (outline, default, etc.)
 * @param className - Additional CSS classes for the button
 * @param children - Custom content for the button (defaults to Move3D icon)
 * @param overlayClassName - Additional CSS classes for the overlay
 * @param indicatorClassName - Additional CSS classes for the active indicator
 * @returns JSX element containing the gesture-enabled settings button
 *
 * @example
 * // Basic usage with default styling
 * <GestureSettingsButton />
 *
 * @example
 * // Custom button variant and styling
 * <GestureSettingsButton
 *   variant="default"
 *   size="lg"
 *   className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg"
 * />
 *
 * @example
 * // Custom overlay styling with themed colors
 * <GestureSettingsButton
 *   variant="outline"
 *   overlayClassName="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-600 max-w-md"
 *   indicatorClassName="bg-slate-700/90 border-slate-600"
 * />
 *
 * @example
 * // Custom icon with colorful theming
 * <GestureSettingsButton
 *   variant="secondary"
 *   className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-300"
 *   overlayClassName="bg-emerald-900/90 border-emerald-500"
 *   indicatorClassName="bg-emerald-600/90 text-emerald-100"
 * >
 *   <Settings className="h-4 w-4" />
 * </GestureSettingsButton>
 *
 * @example
 * // Minimal ghost style with custom content
 * <GestureSettingsButton
 *   variant="ghost"
 *   size="sm"
 *   className="hover:bg-gray-100 rounded-full"
 *   overlayClassName="bg-white/95 text-gray-900 border-gray-200 shadow-xl"
 *   indicatorClassName="bg-gray-800/90 text-white"
 * >
 *   <span className="text-xs">⚙️</span>
 * </GestureSettingsButton>
 *
 * @example
 * // Dark theme with neon accents
 * <GestureSettingsButton
 *   variant="outline"
 *   className="bg-black border-cyan-500 text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300"
 *   overlayClassName="bg-black/95 border-cyan-400 shadow-cyan-500/25"
 *   indicatorClassName="bg-cyan-500/90 text-black shadow-cyan-400/50"
 * />
 *
 * @example
 * // Large floating action button style
 * <GestureSettingsButton
 *   variant="default"
 *   size="icon"
 *   className="h-14 w-14 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-xl hover:shadow-2xl transition-all"
 *   overlayClassName="bg-indigo-900/95 border-indigo-400"
 *   indicatorClassName="bg-indigo-600/95 border-indigo-400"
 * >
 *   <Move3D className="h-6 w-6" />
 * </GestureSettingsButton>
 */
export const GestureSettingsButton: React.FC<GestureSettingsButtonProps> = ({
    variant = "outline",
    size = "sm",
    className,
    children,
    overlayClassName,
    indicatorClassName,
    ...buttonProps
}) => {
    const { updateConfig, size: fontSize, strokeWidth } = useTextConfig();
    const [gestureState, setGestureState] = useState<GestureState>({
        isActive: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        direction: null,
        initialSize: fontSize,
        initialStrokeWidth: strokeWidth,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        buttonRect: null,
    });

    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    /**
     * Provides haptic feedback if available on the device
     * @param intensity - Vibration intensity in milliseconds
     */
    const hapticFeedback = useCallback((intensity: number = 10) => {
        if ("vibrate" in navigator) {
            navigator.vibrate(intensity);
        }
    }, []);

    /**
     * Initiates gesture tracking and starts long press timer
     */
    const handlePointerDown = useCallback(
        (event: React.PointerEvent) => {
            event.preventDefault();
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) return;

            const startX = event.clientX;
            const startY = event.clientY;

            setGestureState((prev) => ({
                ...prev,
                startX,
                startY,
                currentX: startX,
                currentY: startY,
                initialSize: fontSize,
                initialStrokeWidth: strokeWidth,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
                buttonRect: rect,
            }));

            // Set up long press timer
            longPressTimer.current = setTimeout(() => {
                setGestureState((prev) => ({ ...prev, isActive: true }));
                hapticFeedback(20);
            }, LONG_PRESS_DURATION);

            // Capture pointer
            buttonRef.current?.setPointerCapture(event.pointerId);
        },
        [fontSize, strokeWidth, hapticFeedback],
    );

    /**
     * Handles gesture movement and updates text properties based on direction
     * - Vertical movement: Adjusts font size (inverted: up = larger)
     * - Horizontal movement: Adjusts stroke width (right = thicker)
     */
    const handlePointerMove = useCallback(
        (event: React.PointerEvent) => {
            if (!gestureState.isActive) {
                setGestureState((prev) => ({
                    ...prev,
                    currentX: event.clientX,
                    currentY: event.clientY,
                }));
                return;
            }

            const deltaX = event.clientX - gestureState.startX;
            const deltaY = event.clientY - gestureState.startY;

            // Get current screen dimensions and button position for better edge detection
            const currentScreenWidth = window.innerWidth;
            const currentScreenHeight = window.innerHeight;
            const buttonRect = gestureState.buttonRect;

            // Check for edge constraints to prevent unwanted minimum values
            // Consider button position relative to screen edges
            const buttonCenterX = buttonRect
                ? buttonRect.left + buttonRect.width / 2
                : event.clientX;
            const buttonCenterY = buttonRect
                ? buttonRect.top + buttonRect.height / 2
                : event.clientY;

            const isNearLeftEdge =
                event.clientX < EDGE_BUFFER || buttonCenterX < EDGE_BUFFER * 2;
            const isNearRightEdge =
                event.clientX > currentScreenWidth - EDGE_BUFFER ||
                buttonCenterX > currentScreenWidth - EDGE_BUFFER * 2;
            const isNearTopEdge =
                event.clientY < EDGE_BUFFER || buttonCenterY < EDGE_BUFFER * 2;
            const isNearBottomEdge =
                event.clientY > currentScreenHeight - EDGE_BUFFER ||
                buttonCenterY > currentScreenHeight - EDGE_BUFFER * 2;

            // Determine direction if not set
            let direction = gestureState.direction;
            if (
                !direction &&
                (Math.abs(deltaX) > GESTURE_THRESHOLD ||
                    Math.abs(deltaY) > GESTURE_THRESHOLD)
            ) {
                direction =
                    Math.abs(deltaX) > Math.abs(deltaY)
                        ? "horizontal"
                        : "vertical";
                setGestureState((prev) => ({ ...prev, direction }));
                hapticFeedback(5);
            }

            if (direction === "vertical") {
                // Vertical movement controls font size (inverted: up = larger)
                // Prevent extreme changes when near edges
                let sizeDelta = -deltaY * SIZE_SENSITIVITY;

                if (
                    (isNearTopEdge && deltaY < 0) ||
                    (isNearBottomEdge && deltaY > 0)
                ) {
                    sizeDelta *= 0.2; // Further reduce sensitivity near edges
                }

                const newSize = Math.max(
                    8, // Higher minimum to prevent unreadable text
                    Math.min(200, gestureState.initialSize + sizeDelta),
                );
                updateConfig({ size: Math.round(newSize) });
            } else if (direction === "horizontal") {
                // Horizontal movement controls stroke width
                // Prevent extreme changes when near edges
                let strokeDelta = deltaX * STROKE_SENSITIVITY;

                if (
                    (isNearLeftEdge && deltaX < 0) ||
                    (isNearRightEdge && deltaX > 0)
                ) {
                    strokeDelta *= 0.2; // Further reduce sensitivity near edges
                }

                const newStrokeWidth = Math.max(
                    0, // Prevent negative stroke width for better UX
                    Math.min(20, gestureState.initialStrokeWidth + strokeDelta),
                );
                updateConfig({
                    strokeWidth: Math.round(newStrokeWidth * 2) / 2,
                }); // Round to nearest 0.5
            }

            setGestureState((prev) => ({
                ...prev,
                currentX: event.clientX,
                currentY: event.clientY,
            }));
        },
        [gestureState, updateConfig, hapticFeedback],
    );

    /**
     * Ends gesture interaction and resets state
     */
    const handlePointerUp = useCallback(
        (event: React.PointerEvent) => {
            // Clear long press timer
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }

            if (gestureState.isActive) {
                hapticFeedback(15);
            }

            // Reset gesture state
            setGestureState((prev) => ({
                ...prev,
                isActive: false,
                direction: null,
            }));

            // Release pointer capture
            buttonRef.current?.releasePointerCapture(event.pointerId);
        },
        [gestureState.isActive, hapticFeedback],
    );

    // Handle screen orientation/resize changes
    useEffect(() => {
        const handleResize = () => {
            setGestureState((prev) => ({
                ...prev,
                screenWidth: window.innerWidth,
                screenHeight: window.innerHeight,
            }));
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("orientationchange", handleResize);
        };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
        };
    }, []);

    // Get visual feedback styles
    const getButtonStyles = () => {
        let activeClasses = "";

        if (gestureState.isActive) {
            activeClasses =
                "bg-primary text-primary-foreground scale-110 shadow-lg";

            if (gestureState.direction === "vertical") {
                activeClasses += " shadow-blue-500/50";
            } else if (gestureState.direction === "horizontal") {
                activeClasses += " shadow-green-500/50";
            }
        }

        return cn(
            "transition-all duration-200 touch-none select-none",
            activeClasses,
            className,
        );
    };

    const getIconStyles = () => {
        let baseClasses = "h-4 w-4 transition-all duration-200";

        if (gestureState.isActive) {
            if (gestureState.direction === "vertical") {
                baseClasses += " rotate-90 text-blue-400";
            } else if (gestureState.direction === "horizontal") {
                baseClasses += " scale-x-150 text-green-400";
            } else {
                baseClasses += " animate-pulse";
            }
        }

        return baseClasses;
    };

    return (
        <div className="relative">
            <Button
                ref={buttonRef}
                variant={variant}
                size={size}
                className={getButtonStyles()}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                {...buttonProps}
            >
                {children || <Move3D className={getIconStyles()} />}
            </Button>

            {/* Gesture Overlay - Hide once movement starts */}
            {gestureState.isActive && !gestureState.direction && (
                <div
                    className="fixed inset-0 z-50 cursor-pointer"
                    onClick={() => {
                        // Dismiss overlay on background tap
                        if (longPressTimer.current) {
                            clearTimeout(longPressTimer.current);
                            longPressTimer.current = null;
                        }
                        if (gestureState.isActive) {
                            hapticFeedback(15);
                        }
                        setGestureState((prev) => ({
                            ...prev,
                            isActive: false,
                            direction: null,
                        }));
                    }}
                >
                    {/* Background overlay with blur */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in-0 duration-500" />

                    {/* Main content overlay */}
                    <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-95 fade-in-0 duration-500 pointer-events-none">
                        <div
                            className={cn(
                                "bg-black/90 text-white px-8 py-6 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl max-w-sm mx-4 relative pointer-events-auto",
                                overlayClassName,
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {gestureState.direction === "vertical" && (
                                <div className="text-center space-y-4 animate-in slide-in-from-bottom-3 duration-300">
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-blue-400 text-3xl animate-bounce">
                                            ↕
                                        </span>
                                        <div>
                                            <div className="text-xl font-bold">
                                                {fontSize}px
                                            </div>
                                            <div className="text-blue-300 text-sm">
                                                Font Size
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        Move up to increase • Move down to
                                        decrease
                                    </div>
                                    <div className="text-xs text-gray-500 animate-in fade-in-0 duration-700 delay-1000">
                                        Release finger to finish
                                    </div>
                                </div>
                            )}

                            {gestureState.direction === "horizontal" && (
                                <div className="text-center space-y-4 animate-in slide-in-from-right-3 duration-300">
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-green-400 text-3xl animate-pulse">
                                            ↔
                                        </span>
                                        <div>
                                            <div className="text-xl font-bold">
                                                {strokeWidth}px
                                            </div>
                                            <div className="text-green-300 text-sm">
                                                Stroke Width
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        Move right to increase • Move left to
                                        decrease
                                    </div>
                                    <div className="text-xs text-gray-500 animate-in fade-in-0 duration-700 delay-1000">
                                        Release finger to finish
                                    </div>
                                </div>
                            )}

                            {!gestureState.direction && (
                                <div className="text-center space-y-6 animate-in zoom-in-50 duration-500">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Choose Direction
                                        </h3>
                                        <p className="text-gray-300 text-sm">
                                            Move your finger to adjust settings
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="text-blue-400 text-4xl animate-bounce">
                                                ↕
                                            </div>
                                            <div className="text-sm font-medium">
                                                Font Size
                                            </div>
                                            <div className="text-xs text-blue-300">
                                                Up/Down
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-green-400 text-4xl animate-pulse">
                                                ↔
                                            </div>
                                            <div className="text-sm font-medium">
                                                Stroke Width
                                            </div>
                                            <div className="text-xs text-green-300">
                                                Left/Right
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 animate-in fade-in-0 duration-700 delay-1000">
                                        Release finger or tap background to
                                        cancel
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Directional guides */}
                    {!gestureState.direction && (
                        <div className="absolute inset-0 flex items-center justify-center animate-in fade-in-0 duration-700 delay-500 pointer-events-none">
                            {/* Vertical guide */}
                            <div className="absolute w-1 h-32 bg-gradient-to-t from-blue-500/40 via-blue-400/60 to-blue-500/40 rounded-full animate-pulse"></div>
                            {/* Horizontal guide */}
                            <div className="absolute w-32 h-1 bg-gradient-to-r from-green-500/40 via-green-400/60 to-green-500/40 rounded-full animate-pulse"></div>
                        </div>
                    )}

                    {/* Active gesture indicators */}
                    {gestureState.direction && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {gestureState.direction === "vertical" && (
                                <div className="w-2 h-48 bg-gradient-to-t from-transparent via-blue-500/50 to-transparent rounded-full animate-in slide-in-from-bottom-4 duration-300"></div>
                            )}
                            {gestureState.direction === "horizontal" && (
                                <div className="w-48 h-2 bg-gradient-to-r from-transparent via-green-500/50 to-transparent rounded-full animate-in slide-in-from-left-4 duration-300"></div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Minimal indicator when gesture is active but overlay is hidden */}
            {gestureState.isActive && gestureState.direction && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none animate-in slide-in-from-top-2 duration-200">
                    <div
                        className={cn(
                            "bg-black/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/10",
                            indicatorClassName,
                        )}
                    >
                        {gestureState.direction === "vertical" && (
                            <span className="flex items-center gap-1">
                                <span className="text-blue-400">↕</span>
                                <span>{fontSize}px</span>
                            </span>
                        )}
                        {gestureState.direction === "horizontal" && (
                            <span className="flex items-center gap-1">
                                <span className="text-green-400">↔</span>
                                <span>{strokeWidth}px</span>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
