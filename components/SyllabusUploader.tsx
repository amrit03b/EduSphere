"use client";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface SyllabusUploaderProps {
  onSyllabusUploaded?: () => void;
}

export default function SyllabusUploader({ onSyllabusUploaded }: SyllabusUploaderProps) {
  const { user } = useAuth();
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [syllabusText, setSyllabusText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setPastedText("");
  //     setUploadError("");
  //     setUploadSuccess("");
      
  //     // Extract text from file
  //     let text = "";
  //     try {
  //       if (file.type === "application/pdf") {
  //         const pdfjsLib = await import("pdfjs-dist/build/pdf");
  //         (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  //           `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
  //         const arrayBuffer = await file.arrayBuffer();
  //         const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  //         for (let i = 1; i <= pdf.numPages; i++) {
  //           const page = await pdf.getPage(i);
  //           const content = await page.getTextContent();
  //           text += content.items.map((item: any) => item.str).join(" ") + "\n";
  //         }
  //       } else if (file.type.startsWith("image/")) {
  //         const Tesseract = (await import("tesseract.js")).default;
  //         const { data } = await Tesseract.recognize(file, "eng");
  //         text = data.text;
  //       } else {
  //         setUploadError("Unsupported file type. Please upload a PDF or image.");
  //         return;
  //       }
  //       setSyllabusText(text);
  //       setUploadSuccess("Syllabus text extracted successfully!");
  //     } catch (err: any) {
  //       setUploadError(err.message || "Failed to extract text from file.");
  //     }
  //   }
  // };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
    // setSelectedFile(null);
    setUploadError("");
    setUploadSuccess("");
    setSyllabusText(e.target.value);
  };

  const handleUploadSyllabus = async () => {
    if (!user) {
      setUploadError("Please log in to upload a syllabus.");
      return;
    }

    if (!syllabusText.trim()) {
      setUploadError("Please provide syllabus content.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      // 1. Generate breakdown from API
      const response = await fetch("/api/generate-knowledge-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabusContent: syllabusText }),
      });
      const data = await response.json();
      if (!data.chapters) {
        setUploadError("Failed to generate chapter breakdown.");
        setUploading(false);
        return;
      }

      // 2. Save to Firestore
      await addDoc(collection(db, "syllabusBreakdowns"), {
        userId: user.uid,
        syllabusContent: syllabusText,
        breakdown: data.chapters,
        title: data.chapters[0]?.title || "Untitled Syllabus",
        createdAt: serverTimestamp(),
      });

      setUploadSuccess("Syllabus and breakdown saved! You can find it in Past Chats.");
      // setSelectedFile(null);
      setPastedText("");
      setSyllabusText("");
      if (onSyllabusUploaded) {
        onSyllabusUploaded();
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload syllabus and breakdown.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-blossom-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
          <Upload className="h-5 w-5 text-blossom-600" />
          <h2 className="text-xl font-semibold text-gray-800">Upload Your Syllabus</h2>
        </div>
      
      <div className="space-y-4">
        {/* File Upload - Commented out for now */}
        {/* <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload File (PDF or Image)
          </label>
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="text-center text-slate-500">or</div> */}

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Syllabus Text
          </label>
          <textarea
            value={pastedText}
            onChange={handleTextChange}
            placeholder="Enter your syllabus content here..."
            rows={6}
            className="w-full px-3 py-2 border border-blossom-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blossom-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUploadSyllabus}
          disabled={!syllabusText.trim() || uploading}
          className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-blossom-500 to-rose-500 text-white hover:from-blossom-600 hover:to-rose-600 disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center space-x-2 hover:scale-105 transform"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing Syllabus...</span>
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              <span>Process Syllabus</span>
            </>
          )}
        </button>

        {/* Status Messages */}
        {uploadError && (
          <div className="flex items-center space-x-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span className="text-rose-600">{uploadError}</span>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="flex items-center space-x-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-emerald-600">{uploadSuccess}</span>
          </div>
        )}
      </div>
    </div>
  );
}