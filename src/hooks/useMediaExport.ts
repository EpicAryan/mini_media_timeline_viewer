import { useState, useCallback } from "react";
import { useAppSelector } from "@/store";
import { useFFmpeg } from "./useFFmpeg";
import { MediaFile } from "@/store/types";

// Media export with FFmpeg integration
export const useMediaExport = () => {
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportError, setExportError] = useState<string | null>(null);

    const { files, selectedFileId } = useAppSelector((state) => state.media);
    const selectedFile = files.find((file) => file.id === selectedFileId);
    const {
        ready: ffmpegReady,
        loading: ffmpegLoading,
        trimVideo,
        trimAudio,
    } = useFFmpeg();

    // Export image using canvas conversion
    const exportImage = useCallback(async (file: MediaFile) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        return new Promise<void>((resolve, reject) => {
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `exported_${file.name}`;
                        a.click();
                        URL.revokeObjectURL(url);
                        resolve();
                    } else {
                        reject(new Error("Failed to create image blob"));
                    }
                }, "image/png");
            };

            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = file.url;
        });
    }, []);

     // Export video with FFmpeg trimming
    const exportVideo = useCallback(
        async (file: MediaFile) => {
            if (!ffmpegReady) {
                throw new Error(
                    "FFmpeg is not ready. Please wait for it to load."
                );
            }

            try {
                const trimmedDuration = file.trimEnd - file.trimStart;
                const outputUrl = await trimVideo(
                    file.url,
                    file.trimStart,
                    trimmedDuration
                );

                  // Trigger download with trimmed filename
                const a = document.createElement("a");
                a.href = outputUrl;
                a.download = `${file.name.replace(
                    /\.[^/.]+$/,
                    ""
                )}_trimmed.mp4`;
                a.click();

                setTimeout(() => {
                    URL.revokeObjectURL(outputUrl);
                }, 1000);
            } catch (error) {
                throw new Error(`Video export failed: ${error}`);
            }
        },
        [ffmpegReady, trimVideo]
    );

    // Export audio with FFmpeg trimming
    const exportAudioFile = useCallback(
        async (file: MediaFile) => {
            if (!ffmpegReady) {
                throw new Error(
                    "FFmpeg is not ready. Please wait for it to load."
                );
            }

            try {
                const trimmedDuration = file.trimEnd - file.trimStart;
                const outputUrl = await trimAudio(
                    file.url,
                    file.trimStart,
                    trimmedDuration
                );

                const a = document.createElement("a");
                a.href = outputUrl;
                a.download = `${file.name.replace(
                    /\.[^/.]+$/,
                    ""
                )}_trimmed.mp3`;
                a.click();

                setTimeout(() => {
                    URL.revokeObjectURL(outputUrl);
                }, 1000);
            } catch (error) {
                throw new Error(`Audio export failed: ${error}`);
            }
        },
        [ffmpegReady, trimAudio]
    );

     // Main export handler with type detection
    const exportSelectedMedia = useCallback(async () => {
        if (!selectedFile) {
            setExportError("No media file selected");
            return;
        }

        if (
            !ffmpegReady &&
            (selectedFile.type === "video" || selectedFile.type === "audio")
        ) {
            setExportError(
                "FFmpeg is still loading. Please wait and try again."
            );
            return;
        }

        setIsExporting(true);
        setExportProgress(0);
        setExportError(null);

        try {
            setExportProgress(10);

            switch (selectedFile.type) {
                case "image":
                    await exportImage(selectedFile);
                    break;
                case "video":
                    await exportVideo(selectedFile);
                    break;
                case "audio":
                    await exportAudioFile(selectedFile);
                    break;
                default:
                    throw new Error("Unsupported file type");
            }

            setExportProgress(100);

            setTimeout(() => {
                setExportProgress(0);
            }, 2000);
        } catch (error) {
            console.error("Export failed:", error);
            setExportError(
                error instanceof Error ? error.message : "Export failed"
            );
        } finally {
            setIsExporting(false);
        }
    }, [selectedFile, ffmpegReady, exportImage, exportVideo, exportAudioFile]);

    return {
        exportSelectedMedia,
        isExporting,
        exportProgress,
        exportError,
        selectedFile,
        ffmpegReady,
        ffmpegLoading,
        clearError: () => setExportError(null),
    };
};
