import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

export const findOneByKey = async (
  repo: Repository<any>,
  key: string,
  value: any,
) => {
  if (!value || value === null || value === undefined) {
    throw new BadRequestException(`参数${key}不能为空`);
  }
  const entity = await repo.findOneBy({ [key]: value } as any);
  return entity;
};
