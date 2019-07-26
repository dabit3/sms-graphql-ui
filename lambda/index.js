const axios = require('axios')
const gql = require('graphql-tag')
const graphql = require('graphql')
const { print } = graphql
const uuid = require('uuid/v4')

const postMessage = gql`
  mutation createSMS($input: CreateSMSInput!) {
    createSMS(input: $input) {
      originationNumber
      messageBody
    }
  }
`

exports.handler = async (event) => {
  const message = event['Records'][0]['Sns']['Message']
  
  const data = JSON.parse(message)
  
  console.log('data:', data)

  const originationNumber = data["originationNumber"]
  const messageBody = data["messageBody"]

  try {
    const data = await axios({
      url: '<API_URL>',
      method: 'post',
      headers: {
        'x-api-key': '<API_KEY>'
      },
      data: {
        query: print(postMessage),
        variables: {
          input: {
            id: uuid(),
            messageBody,
            originationNumber
          }
        }
      }
    })
    console.log('data successfully posted! :', data)
  } catch (err) {
    console.log('error posting to appsync: ', err)
  }   
}