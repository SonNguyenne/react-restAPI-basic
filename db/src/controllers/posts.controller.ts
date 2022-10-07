import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Posts} from '../models';
import {PostsRepository} from '../repositories';

import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {basicAuthorization} from '../provider/basic.authorization';

export class PostsController {
  constructor(
    @repository(PostsRepository)
    public postsRepository: PostsRepository,
  ) {}

  @post('/posts')
  @response(200, {
    description: 'Posts model instance',
    content: {'application/json': {schema: getModelSchemaRef(Posts)}},
  })
  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Posts, {
            title: 'NewPosts',
            exclude: ['id'],
          }),
        },
      },
    })
    posts: Omit<Posts, 'id'>,
  ): Promise<Posts> {
    return this.postsRepository.create(posts);
  }

  @get('/posts/count')
  @response(200, {
    description: 'Posts model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Posts) where?: Where<Posts>): Promise<Count> {
    return this.postsRepository.count(where);
  }

  @get('/posts')
  @response(200, {
    description: 'Array of Posts model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Posts, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Posts) filter?: Filter<Posts>): Promise<Posts[]> {
    return this.postsRepository.find(filter);
  }

  @patch('/posts')
  @response(200, {
    description: 'Posts PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Posts, {partial: true}),
        },
      },
    })
    posts: Posts,
    @param.where(Posts) where?: Where<Posts>,
  ): Promise<Count> {
    return this.postsRepository.updateAll(posts, where);
  }

  @get('/posts/{id}')
  @response(200, {
    description: 'Posts model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Posts, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Posts, {exclude: 'where'})
    filter?: FilterExcludingWhere<Posts>,
  ): Promise<Posts> {
    return this.postsRepository.findById(id, filter);
  }

  @patch('/posts/{id}')
  @response(204, {
    description: 'Posts PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Posts, {partial: true}),
        },
      },
    })
    posts: Posts,
  ): Promise<void> {
    await this.postsRepository.updateById(id, posts);
  }

  @put('/posts/{id}')
  @response(204, {
    description: 'Posts PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() posts: Posts,
  ): Promise<void> {
    await this.postsRepository.replaceById(id, posts);
  }

  @del('/posts/{id}')
  @response(204, {
    description: 'Posts DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.postsRepository.deleteById(id);
  }
}
