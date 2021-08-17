# This is a lambda that reads a CSV file from an S3 bucket and push the content to a DynamoDB

This uplaoder can read, parse, and uplaod large amount of data. I uploaded 10k rows of CSV in 18 seconds using 364MB memory.

## Steps to deploy

Sorry guys, no automated deploy for this one

1. Create an s3 bucket using defaults
2. Create a new Lambda function from scratch and using defaults too. Make sure you create a new policy/role for this function
3. Edit the role manually and use the `policy.json` as a template. You will have to edit bucket name and DynamoDB table.
4. Edit the index.js as needed. In particular, you will need to edit the DynamoDB table and s3 bucket name and file to parse.
5. Also, you will likely need to edit the parsing and item structure for your DynamoDB item push
6. Do an `npm install` to make sure all the needed modules are in the `node_modules` folder
7. Zip everything with `zip -r uploader.zip .` (pay attention to the ending dot separated with a space in the command). You may need to adapt this command if you are using Windows.
8. Upload the zip file into your Lambda.

And that's it! You can create an easy test to trigger then lambda manually (if you want).

Note: the lambda when created from scratch has a 3 seconds timeout to avoid running for long periods of times. This is a one time only lambda and you probably need it to run for longer time. Mine ran for 18 seconds. Make sure you edit the timeout as needed.

Finally, I did a small test with a small sample CSV with same structure but only 2-3 rows in it. I recommend this so you can fine tune your uploader until you are happy with it for the large upload.
