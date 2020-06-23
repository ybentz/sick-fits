import { rest } from 'msw'

const handlers = [
  rest.post(
    'https://api.cloudinary.com/v1_1/ybentz/image/upload',
    async (req, res, ctx) => {
      return res(
        ctx.json({
          secure_url: 'test-dog-small.jpg',
          eager: [
            {
              secure_url: 'test-dog.jpg',
            },
          ],
        })
      )
    }
  ),
]

export { handlers }
