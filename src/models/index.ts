import { Sequelize } from "sequelize";
import { AssociateUserBookmark, BookmarkFactory } from "./bookmark";
import { UserFactory } from "./user";

const dbName = 'bookmark2DB';
const username = 'root';
const password = 'Password1!';

const sequelize = new Sequelize(dbName, username, password, {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

BookmarkFactory(sequelize);
UserFactory(sequelize);
AssociateUserBookmark();

export const db = sequelize;