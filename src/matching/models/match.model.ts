import { MongooseModule } from "@nestjs/mongoose";
import { MatchSchema } from "../schemas/match.schema";

let MatchModel = MongooseModule.forFeature([{ name: 'Match', schema: MatchSchema, collection: 'matches' }])
export default MatchModel