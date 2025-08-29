// Updated from the last submission to a one-to-one relation
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { UserPreferences } from "./UserPreferences";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  username: string;

  @Column({ type: "text", nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  // @OneToOne(() => UserPreferences, (pref) => pref.user)
  // preferences: UserPreferences;
  @OneToMany(() => UserPreferences, (UserPreferences) => UserPreferences.user)
  userPreferences: UserPreferences[]
}
