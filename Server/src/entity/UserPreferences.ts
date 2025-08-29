// Updated from the last submission to a one-to-one relation
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Length } from "class-validator";
import { User } from "./User";

export enum TempPreference {
  CELSIUS = "celsius",
  FAHRENHEIT = "fahrenheit",
}

@Entity({ name: "user_preferences" })
export class UserPreferences {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text", nullable: false })
  city: string;

  @Column({ nullable: true })
  @Length(2, 2)
  country_code: string | null;

  @Column({
    type: "simple-enum",           // SQLite
    enum: TempPreference,
    default: TempPreference.CELSIUS,
  })
  temperature_unit: TempPreference;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ type: "datetime" })
  updatedAt: Date;

  // @OneToOne(() => User, (user) => user.preferences, { onDelete: "CASCADE" })
  // @JoinColumn({ name: "user_id" }) 
  // user: User;
  @ManyToOne(() => User, (user) => user.userPreferences)
  user: User
}
