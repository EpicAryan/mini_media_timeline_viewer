"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

interface ProgressEvent {
    progress: number;
    time: number;
}

// FFmpeg integration for video/audio processing
export const useFFmpeg = () => {
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const ffmpegRef = useRef<FFmpeg | null>(null);

     // Initialize FFmpeg with WASM loading
    useEffect(() => {
        const loadFFmpeg = async () => {
            try {
                setLoading(true);
                setError(null);

                const ffmpeg = new FFmpeg();
                ffmpegRef.current = ffmpeg;

                ffmpeg.on("log", ({ message }) => {
                    console.log("FFmpeg log:", message);
                });

                ffmpeg.on("progress", ({ progress }: ProgressEvent) => {
                    setProgress(Math.round(progress * 100));
                });

                await ffmpeg.load({
                    coreURL: await toBlobURL(
                        "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
                        "text/javascript"
                    ),
                    wasmURL: await toBlobURL(
                        "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
                        "application/wasm"
                    ),
                });

                setReady(true);
            } catch (err) {
                console.error("Failed to load FFmpeg:", err);
                setError(
                    "Failed to load FFmpeg. Please refresh and try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadFFmpeg();
    }, []);

     // Trim video with precise start/duration
    const trimVideo = useCallback(
        async (
            fileUrl: string,
            startTime: number,
            duration: number
        ): Promise<string> => {
            if (!ready || !ffmpegRef.current) {
                throw new Error("FFmpeg is not ready yet");
            }

            const ffmpeg = ffmpegRef.current;

            try {
                setProgress(0);

                const inputFile = await fetchFile(fileUrl);
                await ffmpeg.writeFile("input.mp4", inputFile);

                 // FFmpeg command arguments for video trimming
                const args = [
                    "-i",
                    "input.mp4",
                    "-ss",
                    startTime.toString(),
                    "-t",
                    duration.toString(),
                    "-c",
                    "copy",
                    "-avoid_negative_ts",
                    "make_zero",
                    "output.mp4",
                ];

                await ffmpeg.exec(args);

                const data = (await ffmpeg.readFile(
                    "output.mp4"
                )) as Uint8Array;
                const buffer = data.buffer;

                  // Handle different buffer types for blob creation
                if (buffer instanceof ArrayBuffer) {
                    const blob = new Blob([buffer], { type: "video/mp4" });
                    const url = URL.createObjectURL(blob);

                    await ffmpeg.deleteFile("input.mp4");
                    await ffmpeg.deleteFile("output.mp4");

                    return url;
                } else {
                    const arrayBuffer = new ArrayBuffer(data.length);
                    const uint8View = new Uint8Array(arrayBuffer);
                    uint8View.set(data);

                    const blob = new Blob([arrayBuffer], { type: "video/mp4" });
                    const url = URL.createObjectURL(blob);

                    await ffmpeg.deleteFile("input.mp4");
                    await ffmpeg.deleteFile("output.mp4");

                    return url;
                }
            } catch (err) {
                console.error("FFmpeg processing failed:", err);
                throw new Error(`Video processing failed: ${err}`);
            }
        },
        [ready]
    );

     // Trim audio with codec copy for speed
    const trimAudio = useCallback(
        async (
            fileUrl: string,
            startTime: number,
            duration: number
        ): Promise<string> => {
            if (!ready || !ffmpegRef.current) {
                throw new Error("FFmpeg is not ready yet");
            }

            const ffmpeg = ffmpegRef.current;

            try {
                setProgress(0);

                const inputFile = await fetchFile(fileUrl);
                await ffmpeg.writeFile("input.mp3", inputFile);

                const args = [
                    "-i",
                    "input.mp3",
                    "-ss",
                    startTime.toString(),
                    "-t",
                    duration.toString(),
                    "-acodec",
                    "copy",
                    "output.mp3",
                ];

                await ffmpeg.exec(args);

                const data = (await ffmpeg.readFile(
                    "output.mp3"
                )) as Uint8Array;
                const buffer = data.buffer;

                if (buffer instanceof ArrayBuffer) {
                    const blob = new Blob([buffer], { type: "audio/mp3" });
                    const url = URL.createObjectURL(blob);

                    await ffmpeg.deleteFile("input.mp3");
                    await ffmpeg.deleteFile("output.mp3");

                    return url;
                } else {
                    const arrayBuffer = new ArrayBuffer(data.length);
                    const uint8View = new Uint8Array(arrayBuffer);
                    uint8View.set(data);

                    const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
                    const url = URL.createObjectURL(blob);

                    await ffmpeg.deleteFile("input.mp3");
                    await ffmpeg.deleteFile("output.mp3");

                    return url;
                }
            } catch (err) {
                console.error("FFmpeg audio processing failed:", err);
                throw new Error(`Audio processing failed: ${err}`);
            }
        },
        [ready]
    );

    return {
        ready,
        loading,
        progress,
        error,
        trimVideo,
        trimAudio,
    };
};
