import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
    Arg,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    buildSchema,
} from "type-graphql";

@ObjectType()
class Book {
    @Field()
    id: string;
    @Field()
    title: string;
    @Field()
    author: string;
}

const books: Book[] = [
    {
        title: "The Awakening",
        author: "Kate Chopin",
        id: "1",
    },
    {
        title: "City of Glass",
        author: "Paul Auster",
        id: "2",
    },
];

@InputType()
class BookInput {
    @Field()
    title: string;

    @Field()
    author: string;
}

@Resolver(Book)
class BookResolver {
    @Query(() => [Book])
    books() {
        return books;
    }

    @Query(() => Book)
    getBookById(@Arg("id") id: string) {
        return books.find((book) => book.id == id);
    }

    @Mutation(() => Book)
    addBook(@Arg("data") { title, author }: BookInput) {
        const lastId = parseInt(books.at(-1).id, 10);
        const id = (lastId + 1).toString();
        books.push({ title, author, id });
        return books.at(-1);
    }
}

const schema = await buildSchema({
    resolvers: [BookResolver],
});

const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
