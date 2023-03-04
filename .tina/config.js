import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.clientId,
  token: process.env.token,
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "posts",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            type: 'image',
            label: 'Hero image',
            name: 'hero_image',
          },
        ],
        ui: {
          router: ({ document }) => `/blog/${document._sys.filename}`,
          // This is an DEMO router. You can remove this to fit your site
          // router: ({ document }) => `/demo/blog/${document._sys.filename}`,
        },
      },
      {
        name: "about",
        label: "About",
        path: "about",
        format: "md",
        fields: [
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            type: 'image',
            label: 'Profile image',
            name: 'profile_image',
          },
        ],
        ui: {
          router: ({ document }) => '/about',
        },
      },
    ],
  },
});
