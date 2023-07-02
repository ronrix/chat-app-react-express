import withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'poppins' : ['Poppins', 'sans-serif']
      },
      gridTemplateColumns: {
        fluid: "repeat(auto-fit, minmax(10rem, 1fr))"
      }
    },
  },
  plugins: [],
});