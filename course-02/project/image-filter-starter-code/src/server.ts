import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Http2SecureServer } from 'http2';
import http from 'http';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req, res) => {

    var { image_url } = req.query;
    
    // check query param
    if(!image_url) {
      res.status(400).send("Must provide image_url");
      return;
    }

    // apply filter
    let filteredImagePath: string;
    try {
      filteredImagePath = await filterImageFromURL(image_url);
    }
    catch(e) {
      console.log(e);
    }

    // ensure filter was applied and saved out 
    if(!filteredImagePath) {
      res.status(400).send("Unable to apply filter to supplied url");
      return;
    }
      
    // send the file and clean up local tmp
    res.sendFile(filteredImagePath, async (err) => {
      if(err) {
        console.log(err);
      }
      await deleteLocalFiles([filteredImagePath]);
    });
   });

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();