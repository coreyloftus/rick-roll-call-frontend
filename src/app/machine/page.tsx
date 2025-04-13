"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useEffect } from "react";
import geminiTest from "../api/geminiCalls";

const Page = () => {
  const [textValue, setTextValue] = useState("");
  const [geminiReply, setGeminiReply] = useState("reply will be here");
  // useEffect(()=> {
  // },[geminiReply])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await geminiTest(textValue);
    console.log(textValue);
    const replyText = await res;
    console.log(replyText);
    setGeminiReply(replyText);
  };
  const badWordDict = ["fuck", "shit", "hell"];
  return (
    <>
    
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h6">Welcome to Answering Machine</Typography>
      <Typography variant="h6">
        {"This is an AI voice generator for Twilio."}
      </Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
          <Typography variant="h6">{"Here's how it works:"}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ul>
            <li>
              <Typography>• Type in a phrase and submit</Typography>
            </li>
            <li>
              <Typography>
                • Google will generate an audio clip of an AI voice speaking
                your phrase
              </Typography>
            </li>
            <li>
              <Typography>
                • When it sounds good to you, click the Load to Twilio button to
                load the audio in to a phone number.
              </Typography>
            </li>
            <li>
              <Typography>
                • When it sounds good to you, click the Load to Twilio button to
                load the audio in to a phone number.
              </Typography>
            </li>
            <li>
              <Typography>
                • Call the number and listen to the audio clip.
              </Typography>
            </li>
          </ul>
        </AccordionDetails>
      </Accordion>
      <TextField
        id="ai-text-input"
        label="AI Text Input"
        variant="outlined"
        fullWidth
        placeholder="Enter your text here..."
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        error={badWordDict.includes(textValue)}
        helperText={badWordDict.includes(textValue) ? "Please avoid using bad words." : ""}
        // change color of input text to white if in dark mode
        sx={{
          input: { color: "white" },
          label: { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "gray",
            },
            "&.Mui-focused fieldset": {
              borderColor: "lightblue",
            },
          },
          "& .MuiInputLabel-root": {
            color: "white",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "lightblue",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "gray",
          },
        }}
            />
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </Button>
      <Box sx={{ mt:6, width: "100%" }}>

      <Typography variant="h6" sx={{textAlign:"left"}}>Gemini Reply:</Typography>
      <Box sx= {{ml:4}}>
      {geminiReply.split("\n").map((line, index) => (
        <Typography key={index} variant="body1">
          {line}
        </Typography>
      ))}
      </Box>
      </Box>
    </Box>
    
    </>
  );
};

export default Page;
