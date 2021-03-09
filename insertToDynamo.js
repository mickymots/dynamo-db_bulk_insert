// JSON - Insert to Dynamo Table
const insertToDynamoTable = async function(json){
    try{
        let dynamoTableName = 'provide_table_name'
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
            
                    var params = {
                        RequestItems: requestItems
                    };
            
                    await ddb.batchWrite(params).promise()
                })
        );
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

// Get DynamoDB records from json
const getDynamoDBRecords = function (data) {
    
    let dynamoDBRecords = data.map(entity => {
      
        let dynamoRecord = Object.assign({ PutRequest: { Item: entity } })

        return dynamoRecord

    })

    return dynamoDBRecords
}