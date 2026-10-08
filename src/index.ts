import dotenv from 'dotenv';
import { createServer } from './api/server';

dotenv.config();

const PORT = parseInt(process.env.PORT || '8080', 10);
const app = createServer();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
