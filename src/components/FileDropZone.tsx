import { Box } from "@mui/material";
import { useDropzone } from "react-dropzone";

interface Props {
  onFileSelected: (acceptedFiles: File[]) => void;
}

const FileDropZone = ({ onFileSelected }: Props) => {
  const onDrop = (acceptedFiles: File[]) => {
    onFileSelected(acceptedFiles);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "3px dotted lightgray",
        cursor: "pointer",
        p: 1,
        textAlign: "center",
        borderRadius: 5,
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here.</p>
      ) : (
        <p>Drag drop some files here, or click to select files.</p>
      )}
    </Box>
  );
};

export default FileDropZone;
