import {Entity, PrimaryGeneratedColumn} from 'typeorm'

@Entity({name: "uploads"})
export class Upload {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}

