// Import required AWS SDK clients and commands for Node.js
const {
    DynamoDBClient,
    BatchWriteItemCommand
  } = require("@aws-sdk/client-dynamodb");

  const fs = require('fs');
  const attr = require('dynamodb-data-types').AttributeValue;


  let rawdata = fs.readFileSync('data.json');
  let json_data = JSON.parse(rawdata);


 // Set the AWS Region
 const REGION = "ca-central-1"; //e.g. "us-east-1"
 const dbclient = new DynamoDBClient({ region: REGION });


// JSON - Insert to Dynamo Table
const insertToDynamoTable = async function(json){
    try{
        let dynamoTableName = 'sample-table'
        // console.info('Dynamo table to use is ' + dynamoTableName)

        let dynamoDBRecords = getDynamoDBRecords(json)

        var batches = [];
    
        while(dynamoDBRecords.length) {
            batches.push(dynamoDBRecords.splice(0, 25));
        }
        
        await Promise.all(
            batches.map(async (batch) =>{
                    requestItems = {}
                    requestItems[dynamoTableName] = batch

                    // console.log(requestItems)
            
                    var params = {
                        RequestItems: requestItems
                    };
                    
                    console.log(params)
                    await dbclient.send(new BatchWriteItemCommand(params))
                })
        );
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

// Get DynamoDB records from json
const getDynamoDBRecords = function (data) {
    
    let dynamoDBRecords = data.Sheet1.map(entity => {

        entity = attr.wrap(entity)
      
        console.log(entity)
        let dynamoRecord = Object.assign({ PutRequest: { Item: entity } })
       // dynamoDBRecord = attr.wrap(dynamoRecord)
        // console.log(dynamoDBRecord)
        return dynamoRecord

    })

    return dynamoDBRecords
}



  
 
  
  // Set the parameters
//   const params = {
//     RequestItems: {
//       TABLE_NAME: [
//         {
//           PutRequest: {
//             Item: {
//               KEY: { N: "KEY_VALUE" },
//               ATTRIBUTE_1: { S: "ATTRIBUTE_1_VALUE" },
//               ATTRIBUTE_2: { N: "ATTRIBUTE_2_VALUE" },
//             },
//           },
//         },
//         {
//           PutRequest: {
//             Item: {
//               KEY: { N: "KEY_VALUE" },
//               ATTRIBUTE_1: { S: "ATTRIBUTE_1_VALUE" },
//               ATTRIBUTE_2: { N: "ATTRIBUTE_2_VALUE" },
//             },
//           },
//         },
//       ],
//     },
//   };
  
  // Create DynamoDB service object
  
  
  const run = async () => {
    try {

    //   json_data = 
     console.log(json_data)
      
     
     const data = await  insertToDynamoTable(json_data) 
      
      //dbclient.send(new BatchWriteItemCommand(params));


      console.log("Success, items inserted", data);
    } catch (err) {
      console.log("Error", err);
    }
  };
  run();
  