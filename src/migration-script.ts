import * as data from "./data.json";

export default async function morph() {
  const { users, articles, subs } = data;
  const newUsers = [], newArticles = [];

  // Users first
  for (const user of users) {
    const obj = {} as any;
    for (const prop in user) {
      if (prop === 'tokens') {
        obj[prop] = user[prop].map(t => t.token);
      } else if (prop === 'reset_key') {
        obj.resetKey = user.reset_key;
      } else if (prop === 'created_at') {
        obj[prop] = convertDate(obj[prop]);
      } else {
        obj[prop] = user[prop];
      }
    }
    newUsers.push(obj);
  }

  // Articles
  for (const article of articles) {
    const obj = {} as any;
    for (const prop in article) {
      if (prop === 'created_at') {
        const date = convertDate(article[prop].$date);
        obj.createdAt = date;
        obj.updatedAt = date;
      } else if (prop === 'comments') {
        article[prop] = article[prop].filter(c => c.name && c.content);
        const comments = article[prop];
        for (const c of comments) {
          c.createdAt = convertDate(c.date.$date);
        }
      } else {
        obj[prop] = article[prop];
      }
      obj.clicks = 0;
    }
    newArticles.push(obj);
  }

  return { users: newUsers, articles: newArticles, subs }
}

function convertDate(old) {
  return Math.floor(new Date(old).getTime() / 1000);
}
