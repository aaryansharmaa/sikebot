import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NFTStorage, File } from "nft.storage";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [url, setURL] = useState(null);
  const [metaurl, setMetaurl] = useState("");

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "https://sikebot.onrender.com/api/v1/dalle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: form.prompt }),
          }
        );
        const data = await response.json();
        //
        // const base64data = Buffer.from(data).toString("base64");
        // const img = `data:${data.photo}; base64` + base64data
        const img = `data:image/jpeg;base64,${data.photo}`; //image being loaded successfully
        setImage(img);
        setForm({ ...form, photo: img });

        const url = await uploadImage(form); // upload to IPFS
        return data;
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const imageData = await generateImage(); // call API to generate image

    // const url = await uploadImage(imageData.photo); // upload to IPFS

    // console.log("url", url);

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch(
          "https://sikebot.onrender.com/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );

        await response.json();
        navigate("/"); // go to home
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and generate the image");
    }
  };

  // IPFS UPLOAD

  const uploadImage = async (imageInfo) => {
    console.log("uploading image");

    try {
      const nftstorage = new NFTStorage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRFQ0Y5OGFEMmZBODhmQzFhYWJmNkUzODJmMzY5YjMxRThkOGJmM2QiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2ODg2MzMxNDQyOSwibmFtZSI6Im5mdGdhcmFnZSJ9.ikydHbjQt7iSZQjZkMrjiP4xLroimsUtPV6_dFHkNEI",
      });
      const { ipnft } = await nftstorage.store({
        image: new File([imageInfo.photo], "image.jpeg", {
          type: "image/jpeg",
        }),
        name: imageInfo.name, // or imagedata?
        description: imageInfo.prompt,
      });
      // Save the URL
      const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;

      console.log("url", url);

      setURL(url);

      return url;
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-2[500px]">
          {" "}
          Create visually stunning images through DALL-E AI
        </p>
      </div>

      <form className="mt-10 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A toy bull trading crypto market"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt={preview}
                className="w-9/12 h-9/12 object-contain opacity-50"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating" : "Generate"}
          </button>

          <button
            type="button"
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            <p>
              View&nbsp;
              <a href={url} target="_blank" rel="noreferrer">
                Metadata
              </a>
            </p>{" "}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            {" "}
            Once you have created the image you want, you can share with others
            in the community
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing" : "Share with community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
